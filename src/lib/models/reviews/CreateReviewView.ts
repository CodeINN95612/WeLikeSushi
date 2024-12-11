export type CreateReviewView = {
	id: string;
	restaurant_id: string;
	visit_date: Date;
	review: string;
	reviewer: string;
	rubric: {
		id: string;
		score: number;
	}[];
};
