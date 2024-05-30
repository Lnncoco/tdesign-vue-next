import { withInstall } from '@td/adapter-vue';
import _Affix from '@td/components-common/src/affix/affix';
import type { TdAffixProps } from './type';

import '@td/components-common/src/affix/style';

export * from './type';
export const Affix = withInstall(_Affix);
export type AffixProps = TdAffixProps;
export default Affix;
