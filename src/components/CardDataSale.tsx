'use client'
import React from "react";
import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react";
import { IconType } from "react-icons/lib";

export default function CardDataSale({icon: Icon, children, title}: {icon: IconType, children: React.ReactNode, title: string}) {
  return (
    <Card className="max-w-fit px-3">
      <CardHeader className="flex gap-3">
        <Icon className="font-bold text-blue-500"/>
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        { children }
      </CardBody>
    </Card>
  );
}