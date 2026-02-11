-- Drop the restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Authenticated users can create salons" ON public.salons;

CREATE POLICY "Authenticated users can create salons"
ON public.salons
FOR INSERT
TO authenticated
WITH CHECK (true);
