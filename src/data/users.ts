export interface MockUser {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: "creator" | "host" | "both";
  bio?: string;
}

export const mockUsers: MockUser[] = [
  {
    _id: "user_creator_01",
    name: "Alex Rivera",
    email: "alex@productionlab.com",
    photoURL: "https://i.pravatar.cc/150?img=11",
    role: "creator",
    bio: "Filmmaker & Production Coordinator • Obsessed with north-facing daylight",
  },
  {
    _id: "user_host_01",
    name: "Jordan Blake",
    email: "jordan@foundrystudios.com",
    photoURL: "https://i.pravatar.cc/150?img=32",
    role: "host",
    bio: "Studio owner & architectural photographer, 5+ years hosting commercial productions",
  },
  {
    _id: "user_both_01",
    name: "Sam Lee",
    email: "sam@studio-collective.com",
    photoURL: "https://i.pravatar.cc/150?img=15",
    role: "both",
    bio: "Creator and host – daylight lofts curator in Brooklyn",
  },
];

// Demo credentials (for documentation, NOT for production storage)
export const demoCredentials = {
  creator: { email: "alex@productionlab.com", password: "Demo123" },
  host: { email: "jordan@foundrystudios.com", password: "Demo123" },
};

export const defaultUserId = "user_creator_01";

