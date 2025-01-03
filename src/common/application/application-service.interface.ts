export interface IApplicationService<TEntryDto, TResponseDto> {
    execute(entryDto: TEntryDto): Promise<TResponseDto>;
}