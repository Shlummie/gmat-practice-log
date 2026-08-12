"use client";

import { useEffect, useState } from "react";
import { PracticeClient } from "../practice/practice-client";

type Due = { question: Parameters<typeof PracticeClient>[0]["presetQuestions"] extends (infer T)[] | undefined ? T : never };

export function ReviewClient() {
  const [questions, setQuestions] = useState<Due["question"][]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => response.json())
      .then((data) => setQuestions(data.map((item: Due) => item.question)));
  }, []);

  return <PracticeClient mode="REVIEW" presetQuestions={questions} />;
}
