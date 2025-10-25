"use client";
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';

type Props = {
  mealId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function QuickView({ mealId, open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!mealId) return;
      setLoading(true);
      try {
        const mod = await import('@/lib/mealdb');
        const d = await mod.fetchMealDetails(mealId);
        if (!ignore) setData(d);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (open) run();
    return () => {
      ignore = true;
    };
  }, [mealId, open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="text-lg font-medium">Quick View</Dialog.Title>
                {loading && <p className="text-sm text-gray-600">Loading…</p>}
                {data && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-3">
                      {data.image_url && <Image src={data.image_url} alt="meal" width={96} height={96} className="w-24 h-24 object-cover rounded" />}
                      <div>
                        <h3 className="text-xl font-semibold">{data.title}</h3>
                        {data.description && <p className="text-gray-600">{data.description}</p>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Ingredients</h4>
                      <ul className="list-disc pl-6 text-sm">
                        {data.ingredients.map((it: any, i: number) => (
                          <li key={i}>{it.qty != null ? `${it.qty} ` : ''}{it.unit ?? ''} {it.name}</li>
                        ))}
                      </ul>
                    </div>
                    {data.instructions?.length > 0 && (
                      <div>
                        <h4 className="font-medium">Instructions</h4>
                        <ol className="list-decimal pl-6 text-sm space-y-1">
                          {data.instructions.map((s: any, i: number) => (<li key={i}>{s.text}</li>))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-5 text-right">
                  <button className="rounded bg-gray-200 px-3 py-1" onClick={onClose}>Close</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
