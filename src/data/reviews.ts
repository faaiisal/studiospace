export interface MockReview {
  _id: string;
  studioId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  shootTag: string;
  date: string;
}

export const mockReviews: MockReview[] = [
  {
    _id: "rev_01",
    studioId: "studio_01",
    userName: "Maya Chen",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    comment: "Perfect north light, verified power specs were accurate. Freight elevator made load-in effortless.",
    shootTag: "Automotive Commercial Shoot",
    date: "2025-10-12",
  },
  {
    _id: "rev_02",
    studioId: "studio_01",
    userName: "David Park",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    rating: 4.9,
    comment: "Host Jordan is incredibly responsive. STC rating exactly as advertised.",
    shootTag: "Fashion Editorial",
    date: "2025-09-28",
  },
  {
    _id: "rev_03",
    studioId: "studio_03",
    userName: "Sarah Kim",
    userAvatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    comment: "Best soundstage in London. Floating floor made dialogue recording pristine.",
    shootTag: "Podcast Series",
    date: "2025-10-05",
  },
];

export const getReviewsByStudio = (studioId: string) => mockReviews.filter(r => r.studioId === studioId);

