let appMain = {
  data () {
    return {
      cacheKey: 'HTML-File-Open-Bat-Factory-app-main',
      cacheAttrs: ['softwarePath', 'directoryPath', 'filenameSuffix', 'filelist'],
      init: false,
      
      softwarePath: 'C:\\Program Files\\Microsoft Office\\Office16\\WINWORD.EXE',
      directoryPath: 'https://d.docs.live.net/123456789/test',
      filenameSuffix: '.docx',
      filelist: `我的文件1
我的文件2`
    }
  },
  mounted () {
    this.dataLoad()
    
    this.inited = true
  },
  watch: {
    softwarePath () {
      this.dataSave()
    },
    directoryPath () {
      this.dataSave()
    },
    filenameSuffix () {
      this.dataSave()
    },
    filelist () {
      this.dataSave()
    },
  },
  computed: {
    directoryPathFormat () {
      let directoryPath = this.directoryPath.trim()
      if (directoryPath.endsWith('\\') === false) {
        if (directoryPath.indexOf('\\') > -1) {
          directoryPath = directoryPath + '\\'
        }
      }
      else if (directoryPath.endsWith('/') === false) {
        if (directoryPath.indexOf('/') > -1) {
          directoryPath = directoryPath + '/'
        }
      }
      
      return directoryPath
    },
    softwarePathFormat () {
      return this.softwarePath.trim()
    },
    filenameSuffixFormat () {
      return this.filenameSuffix.trim()
    },
    files () {
      let files = []
      
      
      
      this.filelist.trim().split('\n').forEach((file) =>{
        file = file.trim()
        
        let filename = `${file}${this.filenameSuffixFormat}.bat`
        let content = `start "" "${this.softwarePathFormat}" "${this.directoryPathFormat}/${file}${this.filenameSuffixFormat}"`
        
        files.push({
          filename,
          content
        })
      })
      
      return files
    }
  },
  methods: {
    dataLoad () {
      let projectFileListData = localStorage.getItem(this.cacheKey)
      if (!projectFileListData) {
        return false
      }
      
      projectFileListData = JSON.parse(projectFileListData)
      for (let key in projectFileListData) {
        this[key] = projectFileListData[key]
      }
    },
    dataSave () {
      if (this.inited === false) {
        return false
      }
      
      let keys = this.cacheAttrs
      
      let data = {}
      keys.forEach(key => {
        data[key] = this[key]
      })
      
      data = JSON.stringify(data)
      localStorage.setItem(this.cacheKey, data)
    },
    downloadBatFiles () {
      if (this.files.length === 0) {
        return false
      }
      
      let zip = new JSZip();
      
      this.files.forEach(({filename, content}) => {
        zip.file(filename, content);
      })
      
      let zipname = (new Date()).mmddhhmm() + '-' + this.files.length + '-bats.zip'
      
      zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
        saveAs(blob, zipname);                          // 2) trigger the download
      }, function (err) {
        console.error(err)
        window.alert(err);
      });
    }
  }
}

module.exports = appMain