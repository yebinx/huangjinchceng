
function saveStringAsFile(text, fileName) {
  var blob = new Blob([text], { type: 'text/plain' });

  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容IE浏览器
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    // 使用FileSaver.js库保存文件
    var downloadLink = document.createElement('a');
    var url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();

    // 清理临时链接
    URL.revokeObjectURL(url);
  }
}

function downloadFile(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      var blob = xhr.response;
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE浏览器
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        // 创建临时链接并模拟点击下载
        var downloadLink = document.createElement('a');
        var url = URL.createObjectURL(blob);

        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();

        // 清理临时链接
        URL.revokeObjectURL(url);
      }
    }
  };

  xhr.send();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async  function downloadAll(){
cocosParticleSystem = cc.director.getScene().children[0].getComponentsInChildren(cc.ParticleSystem);
len =cocosParticleSystem.length;
for (i=0; i < len; i++){
    classData = cocosParticleSystem[i]
    textureFileNameUrl =  classData.spriteFrame._texture.nativeUrl;
    textureFileName = classData._spriteFrame._name + classData._spriteFrame._texture._native;
	plistFileName = classData.name.split("<")[0];
	if (plistFileName == "particle"){
		plistFileName = plistFileName + "__" + classData.node._parent.name;
	}
	plistFileName = plistFileName + ".plist";
    console.log(`解析文件${i+1}/${len}`);
    console.log(`绑定的纹理名 ${textureFileName}`)
    console.log(`纹理下载地址 ${textureFileNameUrl}`)
	console.log(`plist文件名 ${plistFileName}`)
    console.log(`文件 ${i+1}/${len} plist数据开始 `)

    
	plistContent = 
    `
    <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>angle</key>
	<real>${classData.angle}</real>
	<key>angleVariance</key>
	<real>${classData.angleVar}</real>
	<key>blendFuncDestination</key>
	<integer>${classData._dstBlendFactor}</integer>
	<key>blendFuncSource</key>
	<integer>${classData._srcBlendFactor}</integer>
	<key>duration</key>
	<real>${classData.duration}</real>
	<key>emitterType</key>
	<real>${classData.emitterMode}</real>
	<key>positionType</key>
	<real>2</real>
	<key>finishColorAlpha</key>
	<real>${classData._endColor.a / 255}</real>
	<key>finishColorBlue</key>
	<real>${classData._endColor.b / 255}</real>
	<key>finishColorGreen</key>
	<real>${classData._endColor.g / 255}</real>
	<key>finishColorRed</key>
	<real>${classData._endColor.r / 255}</real>
	<key>finishColorVarianceAlpha</key>
	<real>${classData._endColorVar.a / 255}</real>
	<key>finishColorVarianceBlue</key>
	<real>${classData._endColorVar.b / 255}</real>
	<key>finishColorVarianceGreen</key>
	<real>${classData._endColorVar.g / 255}</real>
	<key>finishColorVarianceRed</key>
	<real>${classData._endColorVar.r / 255}</real>
	<key>finishParticleSize</key>
	<real>${classData.endSize}</real>
	<key>finishParticleSizeVariance</key>
	<real>${classData.endSizeVar}</real>
	<key>gravityx</key>
	<real>${classData.gravity.x}</real>
	<key>gravityy</key>
	<real>${classData.gravity.y}</real>
	<key>maxParticles</key>
	<real>${classData.totalParticles}</real>
	<key>maxRadius</key>
	<real>${classData.startRadius}</real>
	<key>maxRadiusVariance</key>
	<real>${classData.startRadiusVar}</real>
	<key>minRadius</key>
	<real>${classData.endRadius}</real>
    <key>minRadiusVariance</key>
	<real>${classData.endRadiusVar}</real>
	<key>particleLifespan</key>
	<real>${classData.life}</real>
	<key>particleLifespanVariance</key>
	<real>${classData.lifeVar}</real>
	<key>radialAccelVariance</key>
	<real>${classData.radialAccelVar}</real>
	<key>radialAcceleration</key>
	<real>${classData.radialAccel}</real>
	<key>rotatePerSecond</key>
	<real>${classData.rotatePerS}</real>
	<key>rotatePerSecondVariance</key>
	<real>${classData.rotatePerSVar}</real>
	<key>rotationEnd</key>
	<real>${classData.endSpin}</real>
	<key>rotationEndVariance</key>
	<real>${classData.endSpinVar}</real>
	<key>rotationStart</key>
	<real>${classData.startSpin}</real>
	<key>rotationStartVariance</key>
	<real>${classData.startSpinVar}</real>
	<key>sourcePositionVariancex</key>
	<real>${classData.posVar.x}</real>
	<key>sourcePositionVariancey</key>
	<real>${classData.posVar.y}</real>
	<key>sourcePositionx</key>
	<real>328.79289940828403</real>
	<key>sourcePositiony</key>
	<real>970.7218934911242</real>
	<key>speed</key>
	<real>${classData.speed}</real>
	<key>speedVariance</key>
	<real>${classData.speedVar}</real>
	<key>startColorAlpha</key>
	<real>${classData._startColor.a/ 255}</real>
	<key>startColorBlue</key>
	<real>${classData._startColor.b/ 255}</real>
	<key>startColorGreen</key>
	<real>${classData._startColor.g/ 255}</real>
	<key>startColorRed</key>
	<real>${classData._startColor.r/ 255}</real>
	<key>startColorVarianceAlpha</key>
	<real>${classData._startColorVar.a/ 255}</real>
	<key>startColorVarianceBlue</key>
	<real>${classData._startColorVar.b/ 255}</real>
	<key>startColorVarianceGreen</key>
	<real>${classData._startColorVar.g/ 255}</real>
	<key>startColorVarianceRed</key>
	<real>${classData._startColorVar.r/ 255}</real>
	<key>startParticleSize</key>
	<real>${classData.startSize}</real>
	<key>startParticleSizeVariance</key>
	<real>${classData.startSizeVar}</real>
	<key>tangentialAccelVariance</key>
	<real>${classData.tangentialAccelVar}</real>
	<key>tangentialAcceleration</key>
	<real>${classData.tangentialAccel}</real>
	<key>textureFileName</key>
	<string>${textureFileName}</string>
	<key>textureImageData</key>
	<string></string>
</dict>
</plist>

    `
	//console.log(plistContent);

	downloadFile(textureFileNameUrl,  textureFileName);
	console.log("downloadFile",  textureFileName)
	await sleep(100)
	saveStringAsFile(plistContent,  plistFileName);
	console.log("saveStringAsFile",  plistFileName)
	
    console.log(`文件 ${i+1}/${len} plist数据结束`)
    console.log("")
    console.log("")
}

}

await downloadAll()
console.log("下载完成")
