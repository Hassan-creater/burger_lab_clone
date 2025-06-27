// hooks/useRotatingPlaceholder.ts
import { useEffect, useState } from "react";

export function useTypingEffect(
  baseText: string,
  words: string[],
  speed: number = 100,
  pause: number = 1500
) {
  const [placeholder, setPlaceholder] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const fullText = `${baseText}${currentWord}`;

    const type = () => {
      if (isDeleting) {
        setPlaceholder(fullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setPlaceholder(fullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex === fullText.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      }
    };

    const timer = setTimeout(type, speed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words, baseText, speed, pause]);

  return placeholder;
}
