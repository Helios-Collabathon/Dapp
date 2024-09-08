import { Button } from "@/app/features/controls/Button";
import { Dialog, DialogDescription } from "@/app/features/controls/Dialog";
import { Strong } from "@/app/features/controls/Text";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const CompletedTransactionDialog = ({
  message,
  txn,
}: {
  message: string;
  txn: string;
}) => {
  const [isOpen, setIsOpen] = useState(txn !== "");

  return (
    <Dialog
      size="md"
      open={isOpen}
      onClose={setIsOpen}
      className="flex flex-col gap-3"
    >
      <Strong className="text-center font-bold text-xl">SUCCESS</Strong>
      <FontAwesomeIcon
        icon={faCircleCheck}
        color="green"
        size="6x"
        className="flex w-full mt-2 items-center"
      />
      <DialogDescription className="text-center">{message}</DialogDescription>
      <Button
        href={txn}
        target="__blank"
        outline
        className="w-full"
        onClick={() => setIsOpen(false)}
      >
        Go to explorer
      </Button>
    </Dialog>
  );
};
