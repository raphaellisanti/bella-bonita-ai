
-- Drop all existing salons policies
DROP POLICY IF EXISTS "Authenticated users can create salons" ON public.salons;
DROP POLICY IF EXISTS "Members can view their salons" ON public.salons;
DROP POLICY IF EXISTS "Owners can update their salon" ON public.salons;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Authenticated users can create salons"
ON public.salons FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Members can view their salons"
ON public.salons FOR SELECT TO authenticated
USING (public.is_salon_member(auth.uid(), id));

CREATE POLICY "Owners can update their salon"
ON public.salons FOR UPDATE TO authenticated
USING (public.is_salon_owner(auth.uid(), id));

-- Fix salon_members policies too
DROP POLICY IF EXISTS "Members can view salon members" ON public.salon_members;
DROP POLICY IF EXISTS "Owners can manage members" ON public.salon_members;
DROP POLICY IF EXISTS "Owners can remove members" ON public.salon_members;
DROP POLICY IF EXISTS "Owners can update members" ON public.salon_members;

CREATE POLICY "Members can view salon members"
ON public.salon_members FOR SELECT TO authenticated
USING (public.is_salon_member(auth.uid(), salon_id));

CREATE POLICY "Owners can manage members"
ON public.salon_members FOR INSERT TO authenticated
WITH CHECK (
  public.is_salon_owner(auth.uid(), salon_id) 
  OR (user_id = auth.uid() AND role = 'owner'::app_role)
);

CREATE POLICY "Owners can remove members"
ON public.salon_members FOR DELETE TO authenticated
USING (public.is_salon_owner(auth.uid(), salon_id));

CREATE POLICY "Owners can update members"
ON public.salon_members FOR UPDATE TO authenticated
USING (public.is_salon_owner(auth.uid(), salon_id));

-- Ensure handle_new_salon trigger exists and is SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_salon()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.salon_members (salon_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_salon_created ON public.salons;
CREATE TRIGGER on_salon_created
  AFTER INSERT ON public.salons
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_salon();
