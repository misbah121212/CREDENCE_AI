
const StatsCard = ({ title, value, icon: Icon, trend, isNegative }: { title: string, value: string, icon: any, trend: string, isNegative?: boolean }) => {
  return (
    <div className="glass-card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-textMuted mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-textMain">{value}</h3>
        <p className={`text-xs mt-2 font-medium ${isNegative ? 'text-danger' : 'text-success'}`}>
          {trend}
        </p>
      </div>
      <div className={`p-3 rounded-full ${isNegative ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatsCard;
