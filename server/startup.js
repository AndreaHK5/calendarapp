Meteor.startup(function () {


UploadServer.init({
    tmpDir: '/storage/uploads/tmp/',
    uploadDir: '/storage/uploads/',
    checkCreateDirectories: false, //create the directories for you
    finished: function(fileInfo, formData) {
        if (formData && formData.tripId != null && formData.userId != null) {
            fileInfo.tripId = formData.tripId;
            fileInfo.userId = formData.userId;

            var _filePath = fileInfo.url.split('/');

            _filePath[_filePath.length -1] = fileInfo.name;


            var _newPath = _filePath.join('/');
            fileInfo.url = _newPath;

            //uploads.insert(fileInfo);
            //Items.update({_id: fileInfo._id}, { $push: { uploads: fileInfo }});
            return fileInfo;
        }
    },
    getFileName: function(fileInfo, formData){
        var _fileName = fileInfo.name.split('.');

        return Random.id() + '.' +  _fileName[_fileName.length - 1];
    }
});

})