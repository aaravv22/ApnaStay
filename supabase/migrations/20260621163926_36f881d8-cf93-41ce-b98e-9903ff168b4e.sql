
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

GRANT SELECT, INSERT, DELETE ON public.saved_listings TO authenticated;
GRANT ALL ON public.saved_listings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

DROP POLICY IF EXISTS "System can insert roles" ON public.user_roles;
CREATE POLICY "System can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (true);

INSERT INTO public.listings
  (type, title, description, address, city, lat, lng, price_monthly, price_daily, price_slot, amenities, images, gender, rating, review_count, is_verified, is_approved, is_available)
VALUES
  ('hostel','SRM Greenfield Boys Hostel','Walk to SRM Main Gate. AC/Non-AC rooms, mess included, 24x7 security.','Potheri, Kattankulathur','Kattankulathur',12.8230,80.0444,8500,NULL,NULL,ARRAY['WiFi','Mess','AC','Laundry','24x7 Security','Power Backup'],ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],'boys',4.5,128,true,true,true),
  ('hostel','SRM Lakeview Girls Hostel','Premium girls hostel with biometric entry, near SRM Kattankulathur.','Maraimalai Nagar Road, Kattankulathur','Kattankulathur',12.8198,80.0411,9500,NULL,NULL,ARRAY['WiFi','Mess','AC','CCTV','Warden','Hot Water'],ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],'girls',4.7,210,true,true,true),
  ('pg','Sai Krishna PG for Boys','Single & double sharing PG, 5 min walk to SRM Kattankulathur.','Potheri Main Road, Kattankulathur','Kattankulathur',12.8215,80.0460,6500,NULL,NULL,ARRAY['WiFi','Food','AC','Geyser','Washing Machine'],ARRAY['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800'],'boys',4.3,87,true,true,true),
  ('pg','Annapurna Girls PG','Home-cooked food, attached bathrooms, opposite SRM University.','Bharathi Salai, Kattankulathur','Kattankulathur',12.8240,80.0455,7000,NULL,NULL,ARRAY['WiFi','Food','Geyser','CCTV','Curfew'],ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],'girls',4.6,156,true,true,true),
  ('pg','Comfort Zone Co-Living','Modern co-living for SRM students with gaming room & gym.','Potheri Station Road, Kattankulathur','Kattankulathur',12.8202,80.0438,11000,NULL,NULL,ARRAY['WiFi','Food','AC','Gym','Gaming Room','Housekeeping'],ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],'coed',4.8,302,true,true,true),
  ('hostel','Vetri Boys Hostel','Budget hostel for SRM engineering students. Veg mess.','Kattankulathur, Chennai','Kattankulathur',12.8260,80.0470,5500,NULL,NULL,ARRAY['WiFi','Mess','Fan','Common TV'],ARRAY['https://images.unsplash.com/photo-1564540583246-934409427776?w=800'],'boys',4.0,64,true,true,true),
  ('gym','FitZone Kattankulathur','24/7 gym near SRM with personal trainers and cardio zone.','Potheri, Kattankulathur','Kattankulathur',12.8225,80.0430,1500,NULL,200,ARRAY['Cardio','Weights','Trainer','AC','Locker'],ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],'coed',4.6,98,true,true,true),
  ('library','StudyHub SRM','Quiet study library with WiFi, AC and coffee. Open till 1 AM.','SRM Nagar, Kattankulathur','Kattankulathur',12.8235,80.0448,2500,NULL,150,ARRAY['WiFi','AC','Coffee','Charging Points','Silent Zone'],ARRAY['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800'],'coed',4.7,142,true,true,true),
  ('mess','Amma Unavagam Mess','South Indian veg & non-veg meals, monthly plans for SRM students.','Potheri, Kattankulathur','Kattankulathur',12.8218,80.0452,3500,120,NULL,ARRAY['Veg','Non-Veg','Home Style','Hygienic'],ARRAY['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'],'coed',4.4,76,true,true,true),
  ('cafe','BrewBros Cafe','Student-friendly cafe with WiFi, perfect for assignments.','SRM Main Gate, Kattankulathur','Kattankulathur',12.8228,80.0440,NULL,NULL,180,ARRAY['WiFi','Coffee','Snacks','AC','Plug Points'],ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],'coed',4.5,221,true,true,true),
  ('pg','VIT Velachery PG','Spacious PG near VIT Chennai with daily housekeeping.','Velachery, Chennai','Chennai',12.9750,80.2200,9000,NULL,NULL,ARRAY['WiFi','Food','AC','Housekeeping'],ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],'coed',4.4,89,true,true,true),
  ('hostel','IIT Madras Boys Hostel','Verified hostel near IIT Madras Adyar.','Adyar, Chennai','Chennai',13.0067,80.2569,7800,NULL,NULL,ARRAY['WiFi','Mess','Security','Study Hall'],ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],'boys',4.2,110,true,true,true),
  ('gym','PowerHouse Gym Chennai','High-end gym near OMR tech park.','OMR, Chennai','Chennai',12.9080,80.2270,2000,NULL,250,ARRAY['Cardio','CrossFit','Trainer','Steam'],ARRAY['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'],'coed',4.7,180,true,true,true),
  ('library','Knowledge Park Library','Premium study space with cubicles & WiFi.','Anna Nagar, Chennai','Chennai',13.0850,80.2100,3000,NULL,180,ARRAY['WiFi','AC','Silent','Cubicles','Coffee'],ARRAY['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800'],'coed',4.6,95,true,true,true);
