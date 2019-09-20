import React from 'react';

import { IconTypes } from '../utils/types';

interface Props {
  onPress: (e: any) => any;
  icon: IconTypes;
}

export default ({ onPress, icon }: Props) => {
  let imgSrc,
    imgSrc2x,
    iconClass = 'icon ';
  switch (icon) {
    case IconTypes.addIdea:
      iconClass = 'add-idea';
      imgSrc = require('../images/btn_addanidea.png');
      imgSrc2x = require('../images/btn_addanidea@2x.png');
      break;
    case IconTypes.edit:
      iconClass += 'icon-pen';
      imgSrc = require('../images/pen.png');
      imgSrc2x = require('../images/pen@2x.png');
      break;
    case IconTypes.confirm:
      imgSrc = require('../images/Confirm_V.png');
      imgSrc2x = require('../images/Confirm_V@2x.png');
      break;
    case IconTypes.cancel:
      imgSrc = require('../images/Cancel_X.png');
      imgSrc2x = require('../images/Cancel_X@2x.png');
      break;
    case IconTypes.delete:
      iconClass += 'icon-bin';
      imgSrc = require('../images/bin.png');
      imgSrc2x = require('../images/bin@2x.png');
      break;

    default:
      return null;
  }
  return (
    <div className="cursor-pointer" role="button" onClick={onPress} onKeyPress={onPress} tabIndex={0}>
      <img alt="icon" className={iconClass} src={imgSrc} srcSet={`${imgSrc2x} 2x`} />
    </div>
  );
};
