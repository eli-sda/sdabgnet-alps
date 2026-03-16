import { useState } from 'react';
import { Button } from 'src/alps/atoms/Button';

const ShareVideoButton = ({
  url,
  btnClassName
}: {
  url: string;
  btnClassName?: string;
}) => {
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  const handleCopy = () => {
    if (!url) return;
    void navigator.clipboard.writeText(url).then(() => {
      setShowCopyLabel(true);
      setTimeout(() => setShowCopyLabel(false), 3000);
    });
  };

  return (
    <Button
      onClick={handleCopy}
      className={btnClassName}
      disabled={showCopyLabel}
      small
      icon="share"
      label={showCopyLabel ? 'Линкът е копиран' : 'Вземи линк'}
      title={showCopyLabel ? 'Линкът е копиран' : 'Копирай линка'}
    />
  );
};

export default ShareVideoButton;
