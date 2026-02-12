
-- 1. CLIENTS: Replace permissive SELECT with salon-scoped access
DROP POLICY IF EXISTS "Members can view clients" ON public.clients;
CREATE POLICY "Members can view clients"
ON public.clients
FOR SELECT
TO authenticated
USING (is_salon_member(auth.uid(), salon_id));

-- 2. SALON_MEMBERS: Replace single SELECT with owner-sees-all + member-sees-own
DROP POLICY IF EXISTS "Members can view salon members" ON public.salon_members;

CREATE POLICY "Owners can view all salon members"
ON public.salon_members
FOR SELECT
TO authenticated
USING (is_salon_owner(auth.uid(), salon_id));

CREATE POLICY "Members can view own membership"
ON public.salon_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. SALONS: Restrict INSERT to authenticated only and keep WITH CHECK true for onboarding
DROP POLICY IF EXISTS "Authenticated users can create salons" ON public.salons;
CREATE POLICY "Authenticated users can create salons"
ON public.salons
FOR INSERT
TO authenticated
WITH CHECK (true);
