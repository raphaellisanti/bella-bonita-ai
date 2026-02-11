
-- ===========================================
-- BELLA BONITA - Schema Inicial
-- ===========================================

-- 1. Enum de roles
CREATE TYPE public.app_role AS ENUM ('owner', 'staff');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.transaction_type AS ENUM ('revenue', 'commission', 'expense', 'refund');
CREATE TYPE public.trigger_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');
CREATE TYPE public.unit_type AS ENUM ('ml', 'g', 'un');

-- 2. Salões (tenant principal)
CREATE TABLE public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Profiles (usuários do sistema)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Vínculo usuário-salão com role
CREATE TABLE public.salon_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'staff',
  commission_rate NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(salon_id, user_id)
);

-- 5. Produtos (estoque por ml/g/un)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  unit unit_type NOT NULL DEFAULT 'ml',
  stock_quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_stock_alert NUMERIC(10,2) DEFAULT 0,
  cost_per_unit NUMERIC(10,4) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Receitas de serviço (produtos consumidos)
CREATE TABLE public.service_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity_used NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Clientes do salão
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birth_date DATE,
  notes TEXT,
  churn_probability NUMERIC(5,4) DEFAULT 0,
  last_visit TIMESTAMPTZ,
  total_visits INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Transações financeiras (com split)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  type transaction_type NOT NULL DEFAULT 'revenue',
  amount NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) DEFAULT 0,
  salon_amount NUMERIC(10,2) DEFAULT 0,
  professional_id UUID REFERENCES public.profiles(id),
  payment_method TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Triggers de marketing (IA)
CREATE TABLE public.marketing_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  message TEXT,
  channel TEXT DEFAULT 'whatsapp',
  status trigger_status NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  ai_reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_salon_members_salon ON public.salon_members(salon_id);
CREATE INDEX idx_salon_members_user ON public.salon_members(user_id);
CREATE INDEX idx_products_salon ON public.products(salon_id);
CREATE INDEX idx_services_salon ON public.services(salon_id);
CREATE INDEX idx_clients_salon ON public.clients(salon_id);
CREATE INDEX idx_clients_churn ON public.clients(salon_id, churn_probability DESC);
CREATE INDEX idx_appointments_salon ON public.appointments(salon_id, start_time);
CREATE INDEX idx_appointments_professional ON public.appointments(professional_id, start_time);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_transactions_salon ON public.transactions(salon_id, created_at);
CREATE INDEX idx_marketing_triggers_salon ON public.marketing_triggers(salon_id, status);

-- ===========================================
-- RLS
-- ===========================================
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_triggers ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is member of salon
CREATE OR REPLACE FUNCTION public.is_salon_member(_user_id UUID, _salon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salon_members
    WHERE user_id = _user_id AND salon_id = _salon_id AND is_active = true
  )
$$;

-- Helper: check if user is owner of salon
CREATE OR REPLACE FUNCTION public.is_salon_owner(_user_id UUID, _salon_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.salon_members
    WHERE user_id = _user_id AND salon_id = _salon_id AND role = 'owner' AND is_active = true
  )
$$;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Salon members can view colleague profiles" ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.salon_members sm1
    JOIN public.salon_members sm2 ON sm1.salon_id = sm2.salon_id
    WHERE sm1.user_id = auth.uid() AND sm2.user_id = profiles.id AND sm1.is_active = true
  ));

-- SALONS policies
CREATE POLICY "Members can view their salons" ON public.salons FOR SELECT
  USING (public.is_salon_member(auth.uid(), id));
CREATE POLICY "Owners can update their salon" ON public.salons FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), id));
CREATE POLICY "Authenticated users can create salons" ON public.salons FOR INSERT
  TO authenticated WITH CHECK (true);

-- SALON_MEMBERS policies
CREATE POLICY "Members can view salon members" ON public.salon_members FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can manage members" ON public.salon_members FOR INSERT
  WITH CHECK (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can update members" ON public.salon_members FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can remove members" ON public.salon_members FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- Multi-tenant policies (all tenant-scoped tables)
-- PRODUCTS
CREATE POLICY "Members can view products" ON public.products FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can manage products" ON public.products FOR INSERT
  WITH CHECK (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can update products" ON public.products FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can delete products" ON public.products FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- SERVICES
CREATE POLICY "Members can view services" ON public.services FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can manage services" ON public.services FOR INSERT
  WITH CHECK (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can update services" ON public.services FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can delete services" ON public.services FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- SERVICE_RECIPES
CREATE POLICY "Members can view recipes" ON public.service_recipes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.services s WHERE s.id = service_recipes.service_id
    AND public.is_salon_member(auth.uid(), s.salon_id)
  ));
CREATE POLICY "Owners can manage recipes" ON public.service_recipes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.services s WHERE s.id = service_recipes.service_id
    AND public.is_salon_owner(auth.uid(), s.salon_id)
  ));
CREATE POLICY "Owners can update recipes" ON public.service_recipes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.services s WHERE s.id = service_recipes.service_id
    AND public.is_salon_owner(auth.uid(), s.salon_id)
  ));
CREATE POLICY "Owners can delete recipes" ON public.service_recipes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.services s WHERE s.id = service_recipes.service_id
    AND public.is_salon_owner(auth.uid(), s.salon_id)
  ));

-- CLIENTS
CREATE POLICY "Members can view clients" ON public.clients FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Members can create clients" ON public.clients FOR INSERT
  WITH CHECK (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Members can update clients" ON public.clients FOR UPDATE
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can delete clients" ON public.clients FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- APPOINTMENTS
CREATE POLICY "Members can view appointments" ON public.appointments FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Members can create appointments" ON public.appointments FOR INSERT
  WITH CHECK (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Members can update appointments" ON public.appointments FOR UPDATE
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can delete appointments" ON public.appointments FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- TRANSACTIONS
CREATE POLICY "Members can view transactions" ON public.transactions FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can create transactions" ON public.transactions FOR INSERT
  WITH CHECK (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can update transactions" ON public.transactions FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- MARKETING_TRIGGERS
CREATE POLICY "Members can view triggers" ON public.marketing_triggers FOR SELECT
  USING (public.is_salon_member(auth.uid(), salon_id));
CREATE POLICY "Owners can manage triggers" ON public.marketing_triggers FOR INSERT
  WITH CHECK (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can update triggers" ON public.marketing_triggers FOR UPDATE
  USING (public.is_salon_owner(auth.uid(), salon_id));
CREATE POLICY "Owners can delete triggers" ON public.marketing_triggers FOR DELETE
  USING (public.is_salon_owner(auth.uid(), salon_id));

-- ===========================================
-- TRIGGERS para updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON public.salons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- Trigger: criar profile automaticamente ao signup
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
