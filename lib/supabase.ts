
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fwfjmrvodwpouwxcqwod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZmptcnZvZHdwb3V3eGNxd29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDkxMDQsImV4cCI6MjA4NDEyNTEwNH0.zMPIsrSnOMHHUdGiLyoho8D2QMcvxUItjfGdmxt499U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
