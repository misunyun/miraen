function sendURL(){
        var qnote = document.getElementById('qnote');
        var gocoderFrameGo = qnote.contentWindow || qnote.contentDocument;
//        var e = '{"action": "@sendURL","data": {"contentList": [{"contentId": "AAA-0001","url": "https://miraen-contents.s3.ap-northeast-2.amazonaws.com/cp/qnote/questions/contents/sub/2015/e/mat/31/0100/04/ac/emat31010004_ac_04/pages/main.xml"}],"contentTotal": 1}}';
        var e = '{"action": "@sendURL","data": {"contentList": [{"contentId": "AAA-0001","url": "https://devpubvw-cms.mirae-n.com/makex/149903/52/m12mmtmt020mmt00b01010199_105/pages/main.xml?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2RldnB1YnZ3LWNtcy5taXJhZS1uLmNvbS9tYWtleCUyRjE0OTkwMyIsImV4cCI6MTcyMTg5NzkyMTA4MSwiaWF0IjoxNzIxODk0MzIxMDgxLCJwYXRoIjoibWFrZXgvMTQ5OTAzIn0.NJrb13vBpgv9X0w8EadXhrA3t0NqFWtA-74BpclCAV0"}],"contentTotal": 1}}';


        gocoderFrameGo.qnoteViewer.onMessage(e+ "");

};