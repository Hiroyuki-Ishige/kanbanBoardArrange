import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oazsbelxwyaaqaturzev.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9henNiZWx4d3lhYXFhdHVyemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE1OTIsImV4cCI6MjA3MTU3NzU5Mn0.M5T4ebH52MPUro0Y5KYkFurW-vH0k3Ia60dU2iScFyc';

export const supabase = createClient(supabaseUrl, supabaseKey);


// Project URL
// https://supabase.com/dashboard/project/oazsbelxwyaaqaturzev