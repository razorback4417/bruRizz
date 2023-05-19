import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { StudentType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [question, setAnswer] = useState("");
  const [student, setStudent] = useState<StudentType>("Passive");
  const [generatedAnswers, setGeneratedAnswers] = useState<String>("");

  const questionRef = useRef<null | HTMLDivElement>(null);

  const scrollToAnswers = () => {
    if (questionRef.current !== null) {
      questionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `You are 'bruRizz GPT,' an AI that comes up with the best rizz for students at UCLA. \
    Your task is to come up with the best rizz response for a ${student} student at UCLA. \
    A 'passive' student would be polite and shy. An 'alpha' student would be overconfident and forceful. \
    A 'cringy' student would use very cringy pickup lines that sound like a elementary school student. \
    Rizz means flirting or making advances towards someone. \

    For your final answer, only provide 2 UCLA related pickup lines labled as "1" and "2". You do not need to write out the answer for each step.
    ${student === "Passive"
      ? "Make sure the answers are relavent for a shy and subtle UCLA student."
      : null
    }
    ${student === "Alpha"
      ? "Make sure the answers are relavent for a dominant and confident UCLA student. This could relate to sports, fighting, or ultimate rizz."
      : null
    }
    ${student === "Cringy"
      ? "Remember to make sure the answers are cringe and related to UCLA."
      : null
    }
      Make sure each generated answer is less than 200 characters. ${question}${question.slice(-1) === "." ? "" : "."
    }`;

  const generateAnswer = async (e: any) => {
    e.preventDefault();
    setGeneratedAnswers("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedAnswers((prev) => prev + chunkValue);
    }
    scrollToAnswers();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>bruRizz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Be the best verizzion of yourself at UCLA
        </h1>
        <p className="text-slate-500 mt-5"> 3 brurizz used so far. Click on the responses to copy to clipboard.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Ask how to rizz at UCLA{" "}
              <span className="text-slate-500">
                (or anything about rizz in general)
              </span>
              .
            </p>
          </div>
          <textarea
            value={question}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. What is the best pickup line for a guy to use at UCLA at 6pm?"
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select student type.</p>
          </div>
          <div className="block">
            <DropDown student={student} setStudent={(newStudent) => setStudent(newStudent)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateAnswer(e)}
            >
              Rizz me up &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedAnswers && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={questionRef}
                >
                  bruRizz Advice:
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedAnswers
                  .substring(generatedAnswers.indexOf("1") + 3)
                  .split("2.")
                  .map((generatedAnswer) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedAnswer);
                          toast("Answer copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedAnswer}
                      >
                        <p>{generatedAnswer}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
