const ProfileCard = ({
  icon: Icon,
  name,
  subtext,
  isTurn,
  rounded,
  border,
}) => (
  <div
    className={`flex items-center gap-4 bg-[#161d26] p-4 ${rounded} ${border}`}
  >
    <div className="rounded-full border border-gray-700/50 bg-[#1c242e] p-2 shadow-inner">
      <Icon className="text-[#f57c00]" size={20} />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-gray-200">{name}</span>
      <span className="text-[15px] uppercase tracking-tighter text-gray-500">
        {subtext}
      </span>
    </div>
    {isTurn && (
      <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-[#f57c00] shadow-[0_0_10px_rgba(245,124,0,0.8)]"></div>
    )}
  </div>
)

export default ProfileCard
