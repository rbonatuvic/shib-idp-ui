import { readFileContents } from './read_file_contents';
const FileReaderMock = {
    DONE: FileReader.DONE,
    EMPTY: FileReader.EMPTY,
    LOADING: FileReader.LOADING,
    readyState: 0,
    error: null,
    result: null,
    abort: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onabort:jest.fn(),
    onerror:jest.fn(),
    onload: jest.fn(),
    onloadend:jest.fn(),
    onloadprogress:jest.fn(),
    onloadstart: jest.fn(),
    onprogress:jest.fn(),
    readAsArrayBuffer: jest.fn(),
    readAsBinaryString: jest.fn(),
    readAsDataURL: jest.fn(),
    readAsText: jest.fn(),
    removeEventListener: jest.fn()
}

xdescribe('read_file_contents', () => {
    const file = new File([new ArrayBuffer(1)], 'file.jpg');
    const fileReader = FileReaderMock;
    jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should resolve file as data URL', async () => {
        fileReader.result = 'file content';
        fileReader.addEventListener.mockImplementation((_, fn) => fn());

        const content = await readFileContents(file);

        expect(content).toBe('file content');
        expect(fileReader.readAsText).toHaveBeenCalledTimes(1);
        expect(fileReader.readAsText).toHaveBeenCalledWith(file);
    });
})

