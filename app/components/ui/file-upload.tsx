"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
  });

  return (
    <div className="w-full text-black" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10 bg-[#e7d3d0]"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) =>
            handleFileChange(Array.from(e.target.files || []))
          }
          className="hidden"
        />

        {/* TEXT */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-base font-bold text-black">
            Upload file
          </p>

          <p className="mt-2 text-base text-black">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative mx-auto mt-10 w-full max-w-xl">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={idx}
                  className="relative z-40 mx-auto mt-4 flex w-full flex-col rounded-md bg-[#a63a33] p-4 shadow-sm"
                >
                  {/* HEADER */}
                  <div className="flex w-full items-center justify-between">
                    <p className="max-w-xs truncate text-white">
                      {file.name}
                    </p>

                    <p className="rounded-lg px-2 py-1 text-sm text-white bg-[#a63a33]">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {/* DETAIL */}
                  <div className="mt-2 flex flex-col text-sm text-white md:flex-row md:justify-between">
                    <p className="rounded-md bg-[#a63a33] px-1 py-0.5">
                      {file.type}
                    </p>

                    <p>
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}

            {/* EMPTY STATE */}
            {!files.length && (
              <motion.div
                variants={mainVariant}
                className="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-[#a63a33]"
              >
                {isDragActive ? (
                  <p className="flex flex-col items-center text-black">
                    Drop it
                    <IconUpload className="h-4 w-4 text-black" />
                  </p>
                ) : (
                  <IconUpload className="h-4 w-4 text-black" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-black opacity-20"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};