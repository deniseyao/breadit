"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubbreaditPayload } from "@/lib/validators/subbreadit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subbreaditId: string;
  subbreaditName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subbreaditId,
  subbreaditName,
}) => {
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubbreaditPayload = {
        subbreaditId,
      };

      const { data } = await axios.post("/api/subbreadit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subbreaditName}`,
        variant: "default",
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubbreaditPayload = {
        subbreaditId,
      };

      const { data } = await axios.post("/api/subbreadit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed from r/${subbreaditName}`,
        variant: "default",
      });
    },
  });

  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnsubLoading}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      onClick={() => subscribe()}
      isLoading={isSubLoading}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
