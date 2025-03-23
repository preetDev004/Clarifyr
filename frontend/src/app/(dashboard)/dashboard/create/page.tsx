'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

type Inputs = {
  botName: string;
  openingMessage: string;
};
const CreateBotPage = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  return (
    <div className="mt-6 flex flex-col justify-center gap-6">
      <div className="flex items-center gap-2">
        <ArrowLeft
          className="h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-custom-sage/20"
          onClick={() => window.history.back()}
        />
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">BOT Details</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4 sm:container md:gap-8"
      >
        {/* Name & Opening */}
        <div className="border-1 flex flex-col gap-4 rounded-md border p-4 shadow-md sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium sm:text-xl">First Impression</h2>
            <p className="text-sm text-muted-foreground">
              Shape your users' first interaction with a captivating bot name
              and a warm welcome message.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid w-full gap-1.5">
              <label htmlFor="bot-name" className="text-sm sm:text-base">
                Bot Name
              </label>
              <Input
                {...register('botName')}
                placeholder="e.g. Chatty Charlie"
                className="placeholder:text-sm"
                id="message-2"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <label htmlFor="opening-message" className="text-sm sm:text-base">
                Opening Message
              </label>
              <Textarea
                rows={3}
                {...register('openingMessage')}
                className="placeholder:text-sm"
                placeholder="e.g. Hey there! I'm Chatty Charlie. What can I help you discover today?"
                id="message-2"
              />
              <p className="text-xs text-muted-foreground sm:text-sm">
                This is your bot's chance to make a stellar first impression.
                Make it count!
              </p>
            </div>
          </div>
        </div>

        <Button className="flex w-fit items-end justify-end" type="submit">
          Save & Create
        </Button>
      </form>
    </div>
  );
};

export default CreateBotPage;
