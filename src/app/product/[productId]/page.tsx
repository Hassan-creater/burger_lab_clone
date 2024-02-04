import React from "react";

export default function Page({
    params
}: {
    params: any;
}) {
	return <div>Product Id: {params.productId}</div>
}
