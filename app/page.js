import IpContainer from './Components/IpContainer';
import TimerController from './Components/TimerController';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] p-10 grid-cols-10 items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="whitespace-nowrap col-start-3 row-start-1 col-span-2">
        <IpContainer />
      </div>
      <main className="col-start-6 row-start-2 items-center sm:items-start">
        <TimerController />
      </main>
      <footer className="row-start-3 col-start-6 whitespace-nowrap">
        <p>
          ILJ STREAMING <span>{new Date().getFullYear()}</span>
        </p>
      </footer>
    </div>
  );
}
