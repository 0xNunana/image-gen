'use client'

import Image from 'next/image';
import { useState, ChangeEvent, FormEvent } from 'react';


interface Variety {
  description: string;
  urls: string[];
}

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[][]>([]);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const url = 'https://ai-image-generator3.p.rapidapi.com/generate';
    const headers = {
      
      'Content-Type': 'application/json', // Use 'Content-Type' instead of 'content-type'
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_X_KEY as string,
      'X-RapidAPI-Host': 'ai-image-generator3.p.rapidapi.com',
    };

    const requestData = {
      prompt: description,
      page: 1,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData), // Convert to JSON string
      });

      if (response.ok) {
        const result = await response.json();
      
        const varieties = result.results.variaties; // Typo corrected

        const urls = varieties.map((variety: Variety) => variety.urls); // Typo corrected

        setImageUrls(urls);
        setIsLoading(false);
      } else {
        console.error('Error:', response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <header className="flex justify-between h-20 bg-slate-500 mx-auto px-5 py-2">
        <p>0xNunana</p>
        <p>generate all</p>
      </header>
      <main className="flex flex-col sm:flex-row min-h-[calc(100vh-5rem)]">
        <div className="w-full sm:w-[30%] border border-r p-2 bg-green-100">
          <form className="flex flex-col p-2" onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              placeholder="Type your prompt here"
              className="h-40 p-1"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
            <button className="bg-zinc-300 mt-2 h-10 w-[10rem] rounded-lg" type="submit">
              Generate
            </button>
          </form>
        </div>
        <div className="p-2 bg-white ">
          {isLoading ? (
            <p>Loading images...</p>
          ) : imageUrls.length > 0 ? (
            imageUrls.map((urls, index) => (
              <div key={index} className='flex flex-wrap gap-3 max-sm:gap-1 max-sm:justify-center'>
              
                {urls.map((url, idx) => (
                  <Image key={idx} src={url} alt={`Generated Image ${idx}`} width={300} height={300} className='mt-2 max-sm:w-[200px] max-sm:h-[200px] max-sm:m-0'/>
                ))}
              </div>
            ))
          ) : null}
        </div>
      </main>
    </div>
  );
}
