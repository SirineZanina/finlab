import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse';

import { Button } from '@/components/ui/button';
import { UploadButtonProps } from './upload-button.types';
import { HTMLProps } from 'react';

const UploadButton = ({
  onUpload,
  className
}: UploadButtonProps) => {
  const { CSVReader } = useCSVReader();

  // TODO: Add a paywall.
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps } : { getRootProps: () => HTMLProps<HTMLDivElement> }) => (
        <div {...getRootProps()} className='w-full lg:w-auto'>
          <Button size='sm' className={className}>
            <Upload className='size-4' />
         	 Import
          </Button>
        </div>
      )}
    </CSVReader>

  );
};

export default UploadButton;
