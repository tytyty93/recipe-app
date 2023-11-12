import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { format } from "date-fns";
import Image from "next/image";
import { UserAvatar } from "@/components/UserAvatar";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "A Recipe App using Typescript and NextJS",
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM do, yyyy");

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-6">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="flex-col overflow-hidden h-fit rounded-lg border border-gray-200 order-last md:order-last">
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className=" text-gray-500">
                  <p className="font-bold">Author:</p>{" "}
                  <p className="text-slate-900">{session?.user.name}</p>
                </dt>
                <dt>
                  <UserAvatar
                    user={{
                      name: session.user.name || null,
                      image: session.user.image || null,
                    }}
                    className="h-10 w-10"
                  />
                </dt>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">
                  <p className="font-bold">Created on:</p> {formattedDate}
                </dt>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
