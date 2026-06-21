
-- Enums
CREATE TYPE public.app_role AS ENUM ('student', 'vendor', 'admin');
CREATE TYPE public.listing_type AS ENUM ('hostel', 'pg', 'gym', 'library', 'mess', 'cafe');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.gender_pref AS ENUM ('boys', 'girls', 'coed');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  college TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + default student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
          NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ listings ============
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type listing_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price_monthly INTEGER,
  price_daily INTEGER,
  price_slot INTEGER,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  gender gender_pref,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX listings_type_city_idx ON public.listings(type, city);
CREATE INDEX listings_location_idx ON public.listings(lat, lng);
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved listings viewable by all" ON public.listings FOR SELECT USING (is_approved = true OR auth.uid() = vendor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors insert own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Vendors update own listings" ON public.listings FOR UPDATE USING (auth.uid() = vendor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors delete own listings" ON public.listings FOR DELETE USING (auth.uid() = vendor_id OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ bookings ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  slot_time TIMESTAMPTZ,
  status booking_status NOT NULL DEFAULT 'pending',
  amount INTEGER NOT NULL,
  payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own bookings" ON public.bookings FOR SELECT USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.vendor_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students/vendors update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.vendor_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ reviews ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, listing_id)
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));

-- ============ saved_listings ============
CREATE TABLE public.saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, listing_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_listings TO authenticated;
GRANT ALL ON public.saved_listings TO service_role;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own wishlist" ON public.saved_listings FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

-- ============ messages ============
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants see messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver marks read" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ============ notifications ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users mark own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============ seed data ============
INSERT INTO public.listings (vendor_id, type, title, description, address, city, lat, lng, price_monthly, price_daily, price_slot, amenities, images, gender, rating, review_count, is_verified) VALUES
(NULL, 'pg', 'Sunrise PG for Boys', 'Premium PG near BITS Pilani with AC rooms, mess and high-speed WiFi. 2 mins walk from main gate.', 'Vidya Vihar Rd, Pilani', 'Pilani', 28.3640, 75.5870, 6500, 350, NULL, ARRAY['AC','WiFi','Mess','Laundry','Parking','24x7 Security'], ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], 'boys', 4.6, 124, true),
(NULL, 'hostel', 'GreenLeaf Girls Hostel', 'Safe, well-lit hostel for girls with CCTV, hot water and home-style food. Walking distance to LPU North Campus.', 'Law Gate, Jalandhar-Delhi GT Rd', 'Phagwara', 31.2540, 75.7050, 7200, 400, NULL, ARRAY['WiFi','Mess','Hot Water','CCTV','Laundry','Study Room'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], 'girls', 4.8, 210, true),
(NULL, 'gym', 'IronCore Fitness', 'Modern gym with cardio + weights, certified trainers and student passes. Open 5am-11pm.', 'Sector 17, Chandigarh', 'Chandigarh', 30.7410, 76.7820, 1500, 200, 150, ARRAY['AC','Trainers','Locker','Cardio','Weights','Sauna'], ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800','https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'], 'coed', 4.5, 88, true),
(NULL, 'library', 'StudyHub 24x7', 'AC reading hall with personal cabins, free WiFi, charging points and unlimited filtered water.', 'Kalu Sarai, Hauz Khas', 'New Delhi', 28.5450, 77.2030, 2500, 100, 50, ARRAY['AC','WiFi','24x7','Cabins','Power Backup','Cafeteria'], ARRAY['https://images.unsplash.com/photo-1568667256549-094345857637?w=800','https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800'], 'coed', 4.7, 156, true),
(NULL, 'mess', 'Annapurna Mess', 'Home-style North Indian + South Indian thali. Monthly tiffin and dine-in both available.', 'Koregaon Park', 'Pune', 18.5360, 73.8930, 3500, 150, 80, ARRAY['Veg','Non-Veg','Tiffin','Dine-in','Hygienic'], ARRAY['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'], 'coed', 4.4, 67, false),
(NULL, 'cafe', 'The Study Brew', 'Cozy cafe perfect for laptop work — strong WiFi, endless coffee refills, all-day breakfast.', 'HSR Layout, Sector 6', 'Bengaluru', 12.9120, 77.6380, NULL, NULL, 200, ARRAY['WiFi','Power Plugs','Coffee','Quiet','Outdoor Seating'], ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800','https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800'], 'coed', 4.9, 312, true),
(NULL, 'pg', 'Crystal Heights PG', 'Premium co-ed PG with single/double rooms, terrace garden and ironing service.', 'Viman Nagar', 'Pune', 18.5660, 73.9170, 8500, 450, NULL, ARRAY['AC','WiFi','Mess','Parking','Gym','Laundry'], ARRAY['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800'], 'coed', 4.3, 95, true),
(NULL, 'hostel', 'Nalanda Boys Hostel', 'Budget-friendly hostel for engineering students. Walking distance to NIT Trichy.', 'Thanjavur Rd', 'Tiruchirappalli', 10.7590, 78.8150, 4500, 250, NULL, ARRAY['WiFi','Mess','Common Room','Laundry'], ARRAY['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'], 'boys', 4.2, 73, false);
