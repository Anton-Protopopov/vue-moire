import eventBas from '@/eventBas';

export default function gotoPage(pageName, color, pageParams) {
  eventBas.$emit('gotoPage', pageName, color, pageParams);
}
