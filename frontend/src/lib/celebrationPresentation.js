import { ACHIEVEMENTS, CHALLENGES, SHOP_ITEMS } from './catalog.js';

const STREAK_REWARDS = { day3: 30, day7: 70, day14: 150 };

export function buildCelebrationPresentation(event, petName = 'صقر') {
  if (event?.type === 'achievement') {
    const achievement = ACHIEVEMENTS[event.id] || {
      title: 'إنجاز جديد',
      desc: 'واصل عاداتك المالية الإيجابية.',
      coins: 0,
      icon: '🏅',
    };
    return {
      variant: 'achievement',
      label: 'إنجاز جديد',
      title: achievement.title,
      description: achievement.desc,
      reward: achievement.coins > 0 ? `+${achievement.coins} NXP` : null,
      icon: achievement.icon,
      accent: 'gold',
    };
  }

  if (event?.type === 'challenge') {
    const challenge = CHALLENGES[event.id] || {
      title: 'تحدٍ مكتمل',
      reward: 0,
      icon: '🎯',
    };
    return {
      variant: 'challenge',
      label: 'اكتمل التحدي',
      title: challenge.title,
      description: 'خطوة جديدة في سلسلة عاداتك المالية الإيجابية.',
      reward: challenge.reward > 0 ? `+${challenge.reward} NXP` : null,
      icon: challenge.icon,
      accent: 'emerald',
    };
  }

  if (event?.type === 'shop') {
    const item = SHOP_ITEMS[event.id] || {
      name: 'إكسسوار جديد',
      price: 0,
      icon: '🎁',
    };
    return {
      variant: 'accessory',
      label: 'تمت الإضافة',
      title: item.name,
      description: `أصبحت ضمن إكسسوارات ${petName} وتم تجهيزها الآن.`,
      reward: item.price > 0 ? `التكلفة: ${item.price} NXP` : null,
      icon: item.icon,
      accent: 'coral',
    };
  }

  if (event?.type === 'streak') {
    const days = Number(String(event.id || '').replace('day', '')) || 0;
    return {
      variant: 'streak',
      label: 'سلسلة ادخار رائعة',
      title: `${days} أيام متتالية`,
      description: `الانضباط صار عادة، وواصلت التقدم مع ${petName}.`,
      reward: STREAK_REWARDS[event.id] ? `+${STREAK_REWARDS[event.id]} NXP` : null,
      icon: '🔥',
      accent: 'coral',
    };
  }

  return {
    variant: 'celebration',
    label: 'لحظة جميلة',
    title: 'أحسنت!',
    description: 'واصل تقدمك مع نديم.',
    reward: null,
    icon: '✨',
    accent: 'coral',
  };
}
