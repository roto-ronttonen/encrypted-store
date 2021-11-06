import clsx from "clsx";
import {
  DropEvent,
  DropzoneInputProps,
  DropzoneRootProps,
  FileRejection,
  useDropzone,
} from "react-dropzone";

export type FileUploaderProps = {
  onDrop:
    | ((
        acceptedFiles: File[],
        fileRejections: FileRejection[],
        event: DropEvent
      ) => void)
    | undefined;
  dragActiveText: string;
  defaultText: string;
  root?: DropzoneRootProps;
  input?: DropzoneInputProps;
};

export default function FileUploader({
  root,
  input,
  onDrop,
  dragActiveText,
  defaultText,
}: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // 20mb
    maxSize: 1024 * 1024 * 20,
  });

  return (
    <div
      {...getRootProps({
        ...root,
        className: clsx("cursor-pointer w-64 h-64", root?.className),
      })}
    >
      <input {...getInputProps(input)} />
      {isDragActive ? <p>{dragActiveText}</p> : <p>{defaultText}</p>}
    </div>
  );
}
