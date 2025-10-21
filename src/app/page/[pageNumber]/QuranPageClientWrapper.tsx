"use client";
import dynamic from "next/dynamic";
import React from "react";

const ClientQuranPage = dynamic(() => import("./ClientQuranPage"), { ssr: false });

export default function QuranPageClientWrapper(props: any) {
  return <ClientQuranPage {...props} />;
}
