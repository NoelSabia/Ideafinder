import { Idea } from "../page";

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard ({ idea }: IdeaCardProps) {
  return (
    <div className="relative z-10 flex flex-col max-w-lg w-full h-full justify-center p-8 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl hover:scale-102 duration-300">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 p-1">
          {idea.problem}
        </h1>
        <h2 className="text-xl text-gray-300 mt-4">
          {idea.mission}
        </h2>
      </div>
      <div className="text-left mt-8 space-y-5">
        <div><h3 className="font-semibold text-gray-200">The Core Reason</h3><p className="text-gray-400 mt-1 text-sm">{idea.reason}</p></div>
        <div><h3 className="font-semibold text-gray-200">Why Customers Will Pay</h3><p className="text-gray-400 mt-1 text-sm">{idea.whyPay}</p></div>
        <div><h3 className="font-semibold text-gray-200">Potential Customers</h3><p className="text-gray-400 mt-1 text-sm">{idea.potentialCustomers}</p></div>
        <div><h3 className="font-semibold text-gray-200">The Competition</h3><p className="text-gray-400 mt-1 text-sm">{idea.competition}</p></div>
        <div className="pt-2">
          <h3 className="font-semibold text-gray-200">The Product Plan</h3>
          <div className="mt-2 pl-2 border-l-2 border-slate-700 space-y-3">
            <div><h4 className="font-medium text-gray-300 text-sm">Minimum Viable Product (MVP)</h4><p className="text-gray-400 mt-1 text-sm">{idea.mvp}</p></div>
            <div><h4 className="font-medium text-gray-300 text-sm">The Finished Product</h4><p className="text-gray-400 mt-1 text-sm">{idea.finishedProduct}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
