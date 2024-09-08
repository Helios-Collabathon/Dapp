import { Button } from "@/app/features/controls/Button";
import { Dialog, DialogDescription } from "@/app/features/controls/Dialog";
import { Strong } from "@/app/features/controls/Text";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export const CompletedTransactionDialog = ({
  message,
  txn,
}: {
  message: string;
  txn: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (txn !== "") {
      setIsOpen(true);
    }
  }, [txn]);

  return (
    <Dialog
      size="xs"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="flex flex-col gap-3 items-center"
    >
      <Strong className="flex w-full gap-2 items-center">
        <FontAwesomeIcon icon={faCircleCheck} />
        Transaction Successful!
      </Strong>
      <DialogDescription>{message}</DialogDescription>
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
