/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GarbaDashGame } from './components/GarbaDashGame';

export default function App() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-purple-950 via-slate-950 to-pink-950 text-slate-100 flex flex-col items-center justify-center p-1 sm:p-3 selection:bg-amber-400 selection:text-slate-900">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xl">
        <GarbaDashGame />
      </div>
    </main>
  );
}
