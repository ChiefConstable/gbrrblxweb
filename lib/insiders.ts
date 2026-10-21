// "Talk to our Insiders" profiles. These are example GBR members: replace them
// with real volunteers from your community (with their permission).
// `discord` is optional and shown as "message on Discord".

export type Insider = {
  slug: string;
  name: string; // Roblox username
  role: string;
  division: string;
  joined: string;
  advice: string;
  bio: string;
  askMeAbout: string[];
  discord?: string;
};

export const INSIDERS: Insider[] = [
  {
    slug: "railfan-ellie",
    name: "RailFan_Ellie",
    role: "Senior Train Driver",
    division: "Train Crew",
    joined: "2025",
    advice: "Learn one route really well before you try them all.",
    bio: "I started as a trainee driver on the Western route and now help train new drivers. My favourite shift is the busy Friday evening timetable out of Paddington.",
    askMeAbout: ["Driver training", "Route knowledge", "Signals and speed limits"],
  },
  {
    slug: "signal-sam",
    name: "SignalSam42",
    role: "Signaller, Reading ROC",
    division: "Control & Operations",
    joined: "2025",
    advice: "Stay calm, talk clearly, and never assume a route is set.",
    bio: "I moved into signalling after a year on the platforms. It's the best way to see the whole railway at once, and there's always something to solve.",
    askMeAbout: ["Signalling basics", "Moving between divisions", "Busy event days"],
  },
  {
    slug: "platform-priya",
    name: "PlatformPriya",
    role: "Station Supervisor",
    division: "Stations",
    joined: "2026",
    advice: "Be the friendliest person on the platform. Everything else you can learn.",
    bio: "I look after the team at Bristol Temple Meads. I love helping new members find their feet and seeing them move on to driving or control.",
    askMeAbout: ["Dispatch", "Customer service", "Your first week"],
  },
  {
    slug: "builder-kai",
    name: "BuilderKai",
    role: "Map Builder",
    division: "Engineering",
    joined: "2025",
    advice: "Share work early. Feedback makes builds better, not worse.",
    bio: "I build stations and track layouts in Roblox Studio. Seeing crews run trains through something you made is the best feeling.",
    askMeAbout: ["Roblox Studio", "Building portfolios", "How engineering reviews work"],
  },
  {
    slug: "hr-hannah",
    name: "HR_Hannah",
    role: "Recruitment Lead",
    division: "Head Office",
    joined: "2025",
    advice: "Be yourself in your application. We're looking for attitude, not experience.",
    bio: "I read every application that comes in and run our group interviews. Ask me anything about applying and what we look for.",
    askMeAbout: ["Applications", "Interviews", "What happens after an offer"],
  },
  {
    slug: "guard-george",
    name: "GuardGeorge",
    role: "Guard",
    division: "Train Crew",
    joined: "2026",
    advice: "Announcements are your superpower. Practise them!",
    bio: "I joined as a complete beginner this year. The mentors made it easy, and now I'm working towards becoming a driver.",
    askMeAbout: ["Starting with no experience", "Being a guard", "Mentoring"],
  },
];
