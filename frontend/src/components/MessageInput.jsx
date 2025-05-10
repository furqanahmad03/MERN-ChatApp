import React, { useEffect, useRef, useState } from 'react';
import { Image, Send, X } from "lucide-react";
import { useChatStore } from '../store/useChatStore';
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messageInputField = useRef(null);
  const { sendMessage } = useChatStore();
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview)
      return;

    let toastId = null;
    if (imagePreview)
      toastId = toast.loading("Sending message...");

    try {
      setIsSendingMessage(true);

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current)
        fileInputRef.current.value = "";
    } catch (error) {
      { toastId ? toast.error(`Failed to send message: ${error}`, { id: toastId }) : toast.error(`Failed to send message: ${error}`); }
      return;
    } finally {
      setIsSendingMessage(false);
    }
    if (toastId)
      toast.dismiss(toastId);
  };

  useEffect(() => {
    messageInputField.current?.focus();
  }, [handleSendMessage])

  return (
    <div>
      <div className="p-4 w-full">
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                type="button"
                hidden={isSendingMessage}
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <form className='flex items-center gap-2' onSubmit={handleSendMessage}>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md !outline-none"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSendingMessage}
              ref={messageInputField}
              autoFocus
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="button"
              className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
              disabled={isSendingMessage}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>

          </div>

          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={(!text.trim() && !imagePreview) || isSendingMessage}
          >
            <Send size={22} />
          </button>

        </form>
      </div>
    </div>
  )
}

export default MessageInput