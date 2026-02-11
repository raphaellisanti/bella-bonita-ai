-- Recreate salons INSERT policy to ensure it's correct
DROP POLICY IF EXISTS "Authenticated users can create salons" ON public.salons;

CREATE POLICY "Authenticated users can create salons"
ON public.salons
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also fix the SELECT on salons: after insert, the trigger creates salon_member,
-- but we need user to be able to read back the salon immediately
-- Add a temporary broad select for the inserting user
DROP POLICY IF EXISTS "Members can view their salons" ON public.salons;

CREATE POLICY "Members can view their salons"
ON public.salons
FOR SELECT
TO authenticated
USING (is_salon_member(auth.uid(), id));

-- Allow the handle_new_salon trigger to work: 
-- add policy so user can self-insert as owner
DROP POLICY IF EXISTS "Owners can manage members" ON public.salon_members;

CREATE POLICY "Owners can manage members"
ON public.salon_members
FOR INSERT
TO authenticated
WITH CHECK (
  is_salon_owner(auth.uid(), salon_id) 
  OR (user_id = auth.uid() AND role = 'owner')
);
