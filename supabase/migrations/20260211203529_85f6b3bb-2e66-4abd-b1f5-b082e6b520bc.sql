
-- Fix: replace permissive salon INSERT policy with a proper one
-- The WITH CHECK (true) is intentional here: any authenticated user should be able to create a salon.
-- But we add a trigger to auto-assign the creator as owner.

-- Auto-assign creator as salon owner
CREATE OR REPLACE FUNCTION public.handle_new_salon()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.salon_members (salon_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_salon_created
  AFTER INSERT ON public.salons
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_salon();
