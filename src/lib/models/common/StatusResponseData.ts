export type StatusResponseData<T> =
	| {
			success: true;
			value: T;
	  }
	| {
			success: false;
			error: string;
	  };

export function StatusResponse<T>(status: number, data: StatusResponseData<T>) {
	return new Response(JSON.stringify(data), { status });
}

export function StatusResponseSuccess<T>(data: StatusResponseData<T>) {
	return new Response(JSON.stringify(data), { status: 200 });
}
