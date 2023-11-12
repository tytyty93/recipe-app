"use client";

import { FC } from "react";
import {
  RecipeCreationRequest,
  RecipeValidator,
} from "@/lib/validators/recipe-form";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import TextareaAutosize from "react-textarea-autosize";
import { Toast } from "@/components/ui/toast";
import { z } from "zod";
import { toast } from "./ui/use-toast";

type FormData = z.infer<typeof RecipeValidator>;

interface EditorProps {}

export const Editor: React.FC<EditorProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(RecipeValidator),
    defaultValues: {
      title: "",
    },
  });
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      cooktime,
      ingredients,
      instructions,
      content,
    }: RecipeCreationRequest) => {
      const payload: RecipeCreationRequest = {
        title,
        cooktime,
        ingredients,
        instructions,
        content,
      };
      const { data } = await axios.post("/api/recipe/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity

      router.push("/");

      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const LinkTool = (await import("@editorjs/link")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          list: List,
          table: Table,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save();

    const payload: RecipeCreationRequest = {
      title: data.title,
      cooktime: data.cooktime,
      ingredients: data.ingredients,
      instructions: data.instructions,
      content: blocks,
    };

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="recipe-create-form"
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <div className="mb-4">
            <label
              htmlFor="recipeTitle"
              className="block text-gray-700 font-bold"
            >
              Recipe Title
            </label>
            <input
              type="text"
              id="recipeTitle"
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              {...register("title")}
              required
            />
            {errors.title && (
              <p className="text-red-500">{`${errors.title.message}`}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="cookTime" className="block text-gray-700 font-bold">
              Cook Time (minutes)
            </label>
            <input
              id="cookTime"
              type="number"
              {...register("cooktime", {
                valueAsNumber: true,
              })}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            {errors.cooktime && (
              <p className="text-red-500">{`${errors.cooktime.message}`}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="ingredients"
              className="block text-gray-700 font-bold"
            >
              Ingredients
            </label>
            <textarea
              id="ingredients"
              {...register("ingredients")}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              required
            ></textarea>
            {errors.ingredients && (
              <p className="text-red-500">{`${errors.ingredients.message}`}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="instructions"
              className="block text-gray-700 font-bold"
            >
              Instructions
            </label>
            <textarea
              id="instructions"
              {...register("instructions")}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            {errors.instructions && (
              <p className="text-red-500">{`${errors.instructions.message}`}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="instructions"
              className="block text-gray-700 font-bold"
            >
              Instructions (prototype)
            </label>
            <div id="editor" className="min-h-[500px]" />
          </div>
        </div>
      </form>
    </div>
  );
};
