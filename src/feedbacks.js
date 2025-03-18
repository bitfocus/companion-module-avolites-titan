module.exports = {
    initFeedbacks: function () {
        let self = this;
        let feedbacks = {};

        if (!self.imageList || Object.keys(self.imageList).length === 0) {
            self.imageList = {};
        }

        feedbacks['image'] = {
            type: 'boolean', 
            name: 'Get picture legend of playback',
            description: 'Updates the key image to the image on your console',
            options: [
                {
                    type: 'number',
                    label: 'User Number',
                    id: 'un',
                    default: 1,
                    min: 1,
                    max: 9999
                }
            ],
            callback: (feedback, bank) => {
                const userNumber = feedback.options.un;
                const image = self.imageList[userNumber]; 

                return {
                    png64: image !== undefined ? image : "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                };
            }
        };
        
        self.setFeedbackDefinitions(feedbacks); 
    }
};
