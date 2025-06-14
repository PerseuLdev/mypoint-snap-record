
import React from 'react';
import { Home, History, Settings, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '../pages/Index';

interface BottomNavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    {
      id: 'home' as ViewType,
      icon: Home,
      label: 'Início',
      active: currentView === 'home'
    },
    {
      id: 'history' as ViewType,
      icon: History,
      label: 'Histórico',
      active: currentView === 'history' || currentView === 'advanced-history'
    },
    {
      id: 'registration' as ViewType,
      icon: Clock,
      label: 'Ponto',
      active: currentView === 'registration'
    },
    {
      id: 'shift-types' as ViewType,
      icon: FileText,
      label: 'Turnos',
      active: currentView === 'shift-types' || currentView === 'shift-management' || currentView === 'alarms'
    },
    {
      id: 'settings' as ViewType,
      icon: Settings,
      label: 'Config',
      active: currentView === 'settings' || currentView === 'advanced-preferences' || currentView === 'user-profile' || currentView === 'profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 h-auto min-h-0 ${
                item.active 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-muted-foreground hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
