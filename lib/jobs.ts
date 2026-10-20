import { createClient } from '@supabase/supabase-js';

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  department: string;
  employment_type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  featured: boolean;
  posted_at: string;
  status: string;
};

// Demo jobs are fictional Roblox roleplay positions, not employment offers.
export const demoJobs: Job[] = [
  {id:'demo-1',slug:'trainee-train-driver',title:'Trainee Train Driver',location:'Plymouth',department:'Train Operations',employment_type:'Roleplay • Training provided',description:'Begin your railway journey by learning how to operate passenger services across our Roblox network. Work through structured training and assessments alongside experienced instructors.',responsibilities:['Complete the driver training programme','Follow signalling and operational procedures','Deliver safe, punctual roleplay services'],requirements:['An active Roblox account','Ability to follow railway rules and instructions','Good communication and teamwork'],featured:true,posted_at:'2026-10-01T09:00:00Z',status:'published'},
  {id:'demo-2',slug:'customer-service-assistant',title:'Customer Service Assistant',location:'Exeter St Davids',department:'Customer Experience',employment_type:'Roleplay • Flexible',description:'Be the welcoming face of our stations. Help customers find their way, answer travel questions and support smooth day-to-day station operations.',responsibilities:['Assist passengers with enquiries','Provide platform and service information','Escalate issues to station management'],requirements:['Friendly and professional attitude','Clear written communication','Willingness to learn station procedures'],featured:true,posted_at:'2026-09-26T10:00:00Z',status:'published'},
  {id:'demo-3',slug:'train-manager',title:'Train Manager',location:'Bristol Temple Meads',department:'Onboard Services',employment_type:'Roleplay • Experienced',description:'Lead the onboard team and help create a reliable, welcoming journey for everyone travelling on the Roblox railway.',responsibilities:['Coordinate station departures','Make accurate passenger announcements','Support and supervise onboard colleagues'],requirements:['Previous railway roleplay experience preferred','Strong attention to detail','Confidence communicating under pressure'],featured:true,posted_at:'2026-09-24T12:00:00Z',status:'published'},
  {id:'demo-4',slug:'signaller',title:'Signaller',location:'Reading',department:'Network Control',employment_type:'Roleplay • Training provided',description:'Help keep the network moving by routing services and coordinating train movements from the control centre.',responsibilities:['Monitor the signalling panel','Communicate with operational staff','Follow incident and disruption protocols'],requirements:['Excellent concentration','Reliable communication','Interest in railway operations'],featured:false,posted_at:'2026-09-20T12:00:00Z',status:'published'},
  {id:'demo-5',slug:'station-supervisor',title:'Station Supervisor',location:'London Paddington',department:'Station Operations',employment_type:'Roleplay • Leadership',description:'Support the daily running of a busy terminus station and coordinate your team during events and services.',responsibilities:['Allocate platform and concourse duties','Support customer service colleagues','Respond to operational issues'],requirements:['Previous roleplay leadership experience','Good organisation','Professional judgement'],featured:false,posted_at:'2026-09-18T12:00:00Z',status:'published'},
  {id:'demo-6',slug:'recruitment-officer',title:'Recruitment Officer',location:'Remote',department:'People & Recruitment',employment_type:'Roleplay • Flexible',description:'Help welcome the next generation of railway colleagues by supporting our Roblox application and selection process.',responsibilities:['Review applications consistently','Coordinate roleplay interviews','Maintain clear candidate communications'],requirements:['Good written English','Fair and respectful decision-making','Ability to handle applicant information responsibly'],featured:false,posted_at:'2026-09-15T12:00:00Z',status:'published'}
];

export async function getJobs(): Promise<Job[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return demoJobs;
  try {
    const client = createClient(url,key,{auth:{persistSession:false}});
    const {data,error} = await client.from('jobs').select('id,slug,title,location,department,employment_type,description,responsibilities,requirements,featured,posted_at,status').eq('status','published').order('posted_at',{ascending:false});
    if(error) { console.error('Supabase vacancies query failed:', error.message); return []; }
    return (data ?? []) as Job[];
  } catch(e) {console.error('Supabase connection error',e); return [];}
}
export async function getJob(slug: string) {return (await getJobs()).find(job=>job.slug === slug) ?? null;}
