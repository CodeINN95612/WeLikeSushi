export type ReviewView = {
	id: string;
	restaurant: string;
	rating: number;
	reviewer: string;
	review_date: string;
	review: string;
};

export function filterReviewView(review: ReviewView, query: string): boolean {
	if (!query || query === '') {
		return true;
	}

	return (
		review.restaurant.toLowerCase().includes(query.toLowerCase()) ||
		review.reviewer.toLowerCase().includes(query.toLowerCase()) ||
		review.review.toLowerCase().includes(query.toLowerCase())
	);
}
