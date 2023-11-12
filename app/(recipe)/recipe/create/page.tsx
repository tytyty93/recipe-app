"use client";

import { FC } from "react";
import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Create Recipe
        </h3>
      </div>
      <Editor />
      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="recipe-create-form">
          Create Recipe
        </Button>
      </div>
    </div>
  );
};

export default page;
