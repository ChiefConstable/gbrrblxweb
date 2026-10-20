-- Fictional roles for the unofficial GBR Roblox railway community.
-- Run after schema.sql. Re-running updates these rows instead of duplicating them.
-- description, responsibilities and requirements are optional: when empty, the
-- job page uses standard copy for that division (see lib/jobs.ts).
insert into public.jobs (slug,title,location,contract_type,employment_type,division,region,category,grade,posted_at,status)
values
('train-driver-london-paddington','Train Driver','London Paddington','Permanent','Full Time','Train Crew','London & Thames Valley','Driving','Grade 3','2026-10-19'::timestamptz,'published'),
('guard-bristol-temple-meads','Guard','Bristol Temple Meads','Permanent','Full Time','Train Crew','Western','Customer Service','Grade 2','2026-10-18'::timestamptz,'published'),
('signaller-reading-roc','Signaller','Reading ROC','Permanent','Full Time','Control & Operations','London & Thames Valley','Signalling','Grade 3','2026-10-17'::timestamptz,'published'),
('station-dispatcher-swindon','Station Dispatcher','Swindon','Permanent','Full Time','Stations','Western','Customer Service','Grade 1','2026-10-16'::timestamptz,'published'),
('network-controller-swindon-control','Network Controller','Swindon Control Centre','Permanent','Full Time','Control & Operations','Western','Signalling','Grade 4','2026-10-15'::timestamptz,'published'),
('hr-assistant-head-office','HR Assistant','Head Office','Permanent','Full Time','Head Office','Remote','HR & Recruitment','Grade 2','2026-10-14'::timestamptz,'published'),
('trainee-driver-plymouth','Trainee Train Driver','Plymouth','Fixed Term','Trainee','Train Crew','South West','Driving','Grade 1','2026-10-13'::timestamptz,'published'),
('customer-host-cardiff-central','Customer Host','Cardiff Central','Permanent','Part Time','Stations','Wales','Customer Service','Grade 1','2026-10-12'::timestamptz,'published'),
('map-builder-engineering','Map Builder','Engineering Studio','Permanent','Part Time','Engineering','Remote','Development & Building','Grade 2','2026-10-11'::timestamptz,'published'),
('lua-scripter-engineering','Lua Scripter','Engineering Studio','Permanent','Full Time','Engineering','Remote','Development & Building','Grade 3','2026-10-10'::timestamptz,'published'),
('events-coordinator-head-office','Events Coordinator','Head Office','Fixed Term','Part Time','Head Office','Remote','Events','Grade 2','2026-10-09'::timestamptz,'published'),
('station-manager-exeter-st-davids','Station Manager','Exeter St Davids','Permanent','Full Time','Stations','South West','Management','Grade 4','2026-10-08'::timestamptz,'published')
on conflict (slug) do update set
  title = excluded.title,
  location = excluded.location,
  contract_type = excluded.contract_type,
  employment_type = excluded.employment_type,
  division = excluded.division,
  region = excluded.region,
  category = excluded.category,
  grade = excluded.grade,
  posted_at = excluded.posted_at,
  status = excluded.status;

-- Optional: hide the demo rows from the first version of the site.
-- Uncomment to run.
-- update public.jobs set status = 'closed'
-- where slug in ('trainee-train-driver','customer-service-assistant','train-manager','signaller','station-supervisor','recruitment-officer');
